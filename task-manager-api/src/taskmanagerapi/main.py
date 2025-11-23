import os
import uvicorn

from dotenv import load_dotenv

from taskmanagerapi.core.app import create_app
from taskmanagerapi.core.configs.core_config import CoreConfig


app = create_app()


def main():
    load_dotenv()
    cfg = CoreConfig()
    uvicorn.run("taskmanagerapi.main:app", host=cfg.host, port=cfg.port, reload=True)
