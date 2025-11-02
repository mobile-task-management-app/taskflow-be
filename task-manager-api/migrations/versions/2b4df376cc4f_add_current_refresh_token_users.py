"""add_current_refresh_token_users

Revision ID: 2b4df376cc4f
Revises: 1ca916101d53
Create Date: 2025-10-21 22:16:27.611886

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2b4df376cc4f"
down_revision: Union[str, Sequence[str], None] = "1ca916101d53"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE users
        ADD COLUMN current_refresh_token TEXT; 
        """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE users
        DROP COLUMN current_refresh_token
        """
    )
