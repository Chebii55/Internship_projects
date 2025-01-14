"""empty message

Revision ID: 309eb358d46d
Revises: 
Create Date: 2024-11-19 23:59:08.069300

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '309eb358d46d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('employees',
    sa.Column('employee_id', sa.Integer(), nullable=False),
    sa.Column('full_name', sa.String(length=100), nullable=False),
    sa.Column('username', sa.String(length=50), nullable=False),
    sa.Column('phone_number', sa.String(length=20), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('id_number', sa.Integer(), nullable=False),
    sa.Column('department', sa.String(length=50), nullable=False),
    sa.Column('job_title', sa.String(length=100), nullable=False),
    sa.Column('date_of_birth', sa.Date(), nullable=False),
    sa.Column('date_hired', sa.Date(), nullable=True),
    sa.Column('employment_status', sa.String(length=20), nullable=False),
    sa.Column('address', sa.String(length=200), nullable=False),
    sa.Column('_password_hash', sa.String(length=128), nullable=False),
    sa.Column('role', sa.String(length=20), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('employee_id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('id_number'),
    sa.UniqueConstraint('phone_number'),
    sa.UniqueConstraint('username')
    )
    op.create_table('leaves',
    sa.Column('leave_id', sa.Integer(), nullable=False),
    sa.Column('employee_id', sa.Integer(), nullable=False),
    sa.Column('leave_type', sa.String(length=20), nullable=False),
    sa.Column('start_date', sa.Date(), nullable=False),
    sa.Column('end_date', sa.Date(), nullable=False),
    sa.Column('status', sa.String(length=20), nullable=False),
    sa.Column('reason', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['employee_id'], ['employees.employee_id'], name=op.f('fk_leaves_employee_id_employees')),
    sa.PrimaryKeyConstraint('leave_id')
    )
    op.create_table('payrolls',
    sa.Column('payroll_id', sa.Integer(), nullable=False),
    sa.Column('employee_id', sa.Integer(), nullable=False),
    sa.Column('basic_pay', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('loans', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('nhif', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('nssf', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('paye', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('deductions', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('allowances', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('net_pay', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('payment_date', sa.Date(), nullable=False),
    sa.ForeignKeyConstraint(['employee_id'], ['employees.employee_id'], name=op.f('fk_payrolls_employee_id_employees')),
    sa.PrimaryKeyConstraint('payroll_id')
    )
    op.create_table('performances',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('employee_id', sa.Integer(), nullable=False),
    sa.Column('review_date', sa.DateTime(), nullable=False),
    sa.Column('rating', sa.Float(), nullable=False),
    sa.Column('comments', sa.String(length=500), nullable=True),
    sa.ForeignKeyConstraint(['employee_id'], ['employees.employee_id'], name=op.f('fk_performances_employee_id_employees'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('performances')
    op.drop_table('payrolls')
    op.drop_table('leaves')
    op.drop_table('employees')
    # ### end Alembic commands ###