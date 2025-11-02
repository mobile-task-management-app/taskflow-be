from concurrent.futures import ThreadPoolExecutor
from logging import Logger
from asyncpg import Pool
from google.cloud.storage import Client

from app.core.configs.core_config import CoreConfig


class Server:
    def __init__(
        self,
        db: Pool,
        cfg: CoreConfig,
        logger: Logger,
        gcs_client: Client,
        background_executor: ThreadPoolExecutor,
    ):
        self.db = db
        self.cfg = cfg
        self.logger = logger
        self.gcs_client = gcs_client
        self.background_executor = background_executor
