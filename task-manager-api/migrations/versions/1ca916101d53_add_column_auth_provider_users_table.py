"""add column auth_provider users table

Revision ID: 1ca916101d53
Revises: 70ebc4bf02eb
Create Date: 2025-10-20 23:11:40.264131

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "1ca916101d53"
down_revision: Union[str, Sequence[str], None] = "70ebc4bf02eb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE users
        ADD COLUMN auth_provider VARCHAR(20); 
        """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE users
        DROP COLUMN auth_provider
        """
    )
