import logging

from taskmanagerapi.core.configs.logger_config import LoggerConfig


def init_logger(cfg: LoggerConfig) -> logging.Logger:
    logger = logging.getLogger("taskflow_logger")
    logger.setLevel(cfg.level.upper())

    if not logger.handlers:
        formatter = logging.Formatter(cfg.fmt)

        # Console handler
        if cfg.console:
            ch = logging.StreamHandler()
            ch.setLevel(cfg.level.upper())
            ch.setFormatter(formatter)
            logger.addHandler(ch)

        # File handler
        fh = logging.FileHandler(cfg.file)
        fh.setLevel(cfg.level.upper())
        fh.setFormatter(formatter)
        logger.addHandler(fh)

    return logger
