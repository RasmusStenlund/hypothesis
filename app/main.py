from fastapi import FastAPI, HTTPException
from sqlmodel import SQLModel, create_engine, Session, select, Field, Column, JSON
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List

class ExperimentBase(SQLModel):
    title: str
    date: str
    name: str

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
    name: Optional[str]= None

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


app = FastAPI(title = "Hypothesis API", description = "An api for storing and retreiving scientific experiment logs")

@app.on_event("startup")
def on_startup():
    create_db()

@app.post("/experiments", response_model = ExperimentPublic)
def create_experiment(experiment: ExperimentCreate):
    with Session(engine) as session:
        db_experiment = Experiment.model_validate(experiment)

        session.add(db_experiment)
        session.commit()
        session.refresh(db_experiment)
        return db_experiment
    
@app.patch("/experiments/{experiment_id}", response_model = ExperimentPublic)
def update_experiment(experiment_id: int, experiment: ExperimentUpdate):
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


@app.get("/experiments", response_model = list[ExperimentPublic])
def get_experiments():
    with Session(engine) as session:
        experiments = session.exec(select(Experiment)).all()
        return experiments
    
@app.get("/experiments/{experiment_id}", response_model = ExperimentPublic)
def get_experiment(experiment_id: int):
    with Session(engine) as session:
        experiment = session.get(Experiment, experiment_id)
        if not experiment:
            raise HTTPException(
                status_code = 404,
                detail = "Experiment not found"
            )
        return experiment
    
