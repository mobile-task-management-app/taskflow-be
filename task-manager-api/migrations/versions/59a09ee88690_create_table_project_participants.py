"""create table project participants

Revision ID: 59a09ee88690
Revises: bdddfb5cb2c7
Create Date: 2025-10-23 22:30:38.986419

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "59a09ee88690"
down_revision: Union[str, Sequence[str], None] = "bdddfb5cb2c7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
            CREATE TYPE project_participant_role AS ENUM (
                'VIEWER',
                'EDITOR',
                'OWNER'
            );
            CREATE TABLE project_participants (
                -- Foreign Key to the users table
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                
                -- Foreign Key to the projects table
                project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                
                -- Role using the custom ENUM type
                role project_participant_role NOT NULL DEFAULT 'VIEWER',
                
                -- Timestamps
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                
                -- Define the composite primary key
                PRIMARY KEY (user_id, project_id)
            );
               """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS project_partipants;
        DROP TYPE project_participant_role;
        """
    )
