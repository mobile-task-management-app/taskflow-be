import os
import uvicorn

from dotenv import load_dotenv

from app.core.app import create_app
from app.core.configs.core_config import CoreConfig


app = create_app()


def main():
    load_dotenv()
    cfg = CoreConfig()
    uvicorn.run("main:app", host=cfg.host, port=cfg.port, reload=True)


if __name__ == "__main__":
    main()
