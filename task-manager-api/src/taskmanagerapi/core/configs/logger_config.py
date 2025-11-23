from pydantic import BaseModel, Field


class LoggerConfig(BaseModel):
    level: str = Field(
        "INFO", description="Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)"
    )
    file: str = Field("app.log", description="Path to log file")
    console: bool = Field(True, description="Enable console logging")
    fmt: str = Field(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        description="Log message format",
    )
