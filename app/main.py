from datetime import datetime, timedelta, timezone

import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import SQLModel, create_engine, Session, select, Field, Column, JSON
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Annotated
from pydantic import BaseModel
from pwdlib import PasswordHash

import os
from dotenv import load_dotenv

load_dotenv()

secret_key = os.getenv("secret_key")
algorithm = "HS256"
access_token_minutes = 30

class Token(BaseModel):
    access_token: str
    token_type: str

class User(SQLModel, table = True):
    id: Optional[int] = Field(default = None, primary_key = True)

    username: str = Field(unique = True)
    display_name: str
    email: str
    hashed_password: str

class UserCreate(SQLModel):
    username: str
    display_name: str
    email: str
    password: str

class UserPublic(SQLModel):
    id: int
    username: str
    display_name: str
    email: str

class ExperimentBase(SQLModel):
    title: str
    date: str
    contributors: List[str] = Field(sa_column = Column(JSON))

    introduction: str
    hypothesis: str
    materials: List[str] = Field(sa_column = Column(JSON))
    method: str
    results: str
    discussion: str
    conclusion: str

class ExperimentUpdate(SQLModel):
    title: Optional[str] = None
    date: Optional[str] = None
    contributors: Optional[List[str]] = None

    introduction: Optional[str] = None
    hypothesis: Optional[str] = None
    materials: Optional[List[str]] = None
    method: Optional[str] = None
    results: Optional[str] = None
    discussion: Optional[str] = None
    conclusion: Optional[str] = None

class Experiment(ExperimentBase, table = True):
    id: Optional[int] = Field(default = None, primary_key = True)

class ExperimentCreate(ExperimentBase):
    pass

class ExperimentPublic(ExperimentBase):
    id: int

sqlite_database = "database.db"
sqlite_url = f"sqlite:///{sqlite_database}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

def create_db():
    SQLModel.metadata.create_all(engine)

password_hash = PasswordHash.recommended()

app = FastAPI(title = "Hypothesis API", description = "An api for storing and retreiving scientific experiment logs")

def create_access_token(data):
    to_encode = data.copy()
    
    expire = datetime.now(timezone.utc) + timedelta(minutes = access_token_minutes)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm = algorithm)

    return encoded_jwt  

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def get_password_hash(password):
    return password_hash.hash(password)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "token")

def get_user(username: str):
    with Session(engine) as session:
        statement = select(User).where(User.username == username)
        user = session.exec(statement).first()

        return user

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, secret_key, algorithms = [algorithm])
        username = payload.get("sub")
        if username is None: 
            raise HTTPException(
                status_code = 401,
                detail = "Not authenticated"
            )
    except InvalidTokenError:
        raise HTTPException(
            status_code = 401,
            detail = "Not authenticated"
        )
    
    user = get_user(username)

    if user is None:
        raise HTTPException(
            status_code = 401,
            detail = "Not authenticated"
        )
    
    return user

@app.on_event("startup")
def on_startup():
    create_db()

@app.post("/users", response_model = UserPublic)
def create_user(user: UserCreate):
    existing_user = get_user(user.username)
    if existing_user:
        raise HTTPException(
            status_code = 400,
            detail = "Username already exists"
        )
    hashed_password = get_password_hash(user.password)

    db_user = User(username = user.username, display_name = user.display_name, email = user.email, hashed_password = hashed_password)

    with Session(engine) as session:
        session.add(db_user)
        session.commit()
        session.refresh(db_user)

    return db_user

@app.post("/token", response_model = Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = get_user(form_data.username)
    if not user:
        raise HTTPException(
            status_code = 400,
            detail = "Incorrect username or password"
        )
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code = 400,
            detail = "Incorrect username or password"
        )
    
    return {"access_token": create_access_token({"sub": user.username}), "token_type": "bearer"}

@app.post("/experiments", response_model = ExperimentPublic)
async def create_experiment(current_user: Annotated[User, Depends(get_current_user)], experiment: ExperimentCreate):
    with Session(engine) as session:
        db_experiment = Experiment.model_validate(experiment)

        session.add(db_experiment)
        session.commit()
        session.refresh(db_experiment)
        return db_experiment
    
@app.patch("/experiments/{experiment_id}", response_model = ExperimentPublic)
async def update_experiment(current_user: Annotated[User, Depends(get_current_user)], experiment_id: int, experiment: ExperimentUpdate):
    with Session(engine) as session:
        db_experiment = session.get(Experiment, experiment_id)
        if not db_experiment:
            raise HTTPException(
                status_code = 404,
                detail = "Experiment not found"
            )
        experiment_data = experiment.model_dump(exclude_unset = True)
        db_experiment.sqlmodel_update(experiment_data)

        session.add(db_experiment)
        session.commit()
        session.refresh(db_experiment)
        return db_experiment
    
@app.delete("/experiments/{experiment_id}")
async def delete_experiment(current_user: Annotated[User, Depends(get_current_user)], experiment_id: int):
    with Session(engine) as session:
        experiment = session.get(Experiment, experiment_id)
        if not experiment:
            raise HTTPException(
                status_code = 404,
                detail = "Experiment not found"
            )
        session.delete(experiment)
        session.commit()
        return {"ok": True}


@app.get("/experiments", response_model = list[ExperimentPublic])
async def get_experiments(current_user: Annotated[User, Depends(get_current_user)]):
    with Session(engine) as session:
        experiments = session.exec(select(Experiment)).all()
        return experiments
    
@app.get("/experiments/{experiment_id}", response_model = ExperimentPublic)
async def get_experiment(current_user: Annotated[User, Depends(get_current_user)], experiment_id: int):
    with Session(engine) as session:
        experiment = session.get(Experiment, experiment_id)
        if not experiment:
            raise HTTPException(
                status_code = 404,
                detail = "Experiment not found"
            )
        return experiment
    
