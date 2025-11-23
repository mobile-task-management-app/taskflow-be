from pydantic import BaseModel


class GCSConfig(BaseModel):
    bucket: str
