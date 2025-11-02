from pydantic import BaseModel


class DBConfig(BaseModel):
    endpoint: str
    min_size: int = 1
    max_size: int = 10
    timeout: int = 30
    max_idle: int = 300
