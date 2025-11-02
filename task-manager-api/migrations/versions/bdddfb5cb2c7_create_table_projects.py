"""create table projects

Revision ID: bdddfb5cb2c7
Revises: 2b4df376cc4f
Create Date: 2025-10-22 22:30:25.877345

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "bdddfb5cb2c7"
down_revision: Union[str, Sequence[str], None] = "2b4df376cc4f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE projects (
            id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            owner_id int NOT NULL,
            description VARCHAR(100),
            start_date DATE,
            end_date DATE,
            logo_extension VARCHAR(10), 
            logo_storage_path TEXT,
            tag_ids INTEGER[],
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE projects;
        """
    )
