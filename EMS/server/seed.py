from app import db, app
from models import Employee, Leave, Payroll, Performance
from faker import Faker
from datetime import datetime
import random

fake = Faker()

# Seed Employee data
def seed_employees(n=10):
    for _ in range(n):
        employee = Employee(
            full_name=fake.name(),
            username=fake.user_name(),
            phone_number=fake.phone_number(),
            email=fake.email(),
            id_number=fake.unique.random_number(digits=8),
            department=fake.job(),
            job_title=fake.word(),
            date_of_birth=fake.date_of_birth(minimum_age=18, maximum_age=65),
            date_hired=fake.date_this_decade(),
            employment_status=random.choice(["Full-time", "Part-time", "Contract"]),
            address=fake.address(),
            _password_hash="password",
            role=random.choice(["admin", "manager", "staff"]),
        )
        db.session.add(employee)

    db.session.commit()
    print(f"{n} employees seeded successfully.")

# Seed Leave data
def seed_leaves(n=20):
    employees = Employee.query.all()
    for _ in range(n):
        leave = Leave(
            employee_id=random.choice(employees).employee_id,
            leave_type=random.choice(["Sick", "Vacation", "Unpaid"]),
            start_date=fake.date_this_year(),
            end_date=fake.date_this_year(),
            status=random.choice(["Approved", "Pending", "Rejected"]),
            reason=fake.text(max_nb_chars=100),
        )
        db.session.add(leave)

    db.session.commit()
    print(f"{n} leaves seeded successfully.")

# Seed Payroll data
def seed_payrolls(n=10):
    employees = Employee.query.all()
    for _ in range(n):
        payroll = Payroll(
            employee_id=random.choice(employees).employee_id,
            basic_pay=fake.random_number(digits=5),
            loans=fake.random_number(digits=3),
            nhif=fake.random_number(digits=2),
            nssf=fake.random_number(digits=2),
            paye=fake.random_number(digits=3),
            deductions=fake.random_number(digits=3),
            allowances=fake.random_number(digits=3),
            net_pay=fake.random_number(digits=5),
            payment_date=fake.date_this_month(),
        )
        db.session.add(payroll)

    db.session.commit()
    print(f"{n} payrolls seeded successfully.")

# Seed Performance data
def seed_performances(n=10):
    employees = Employee.query.all()
    for _ in range(n):
        performance = Performance(
            employee_id=random.choice(employees).employee_id,
            review_date=fake.date_this_year(),
            rating=random.uniform(1.0, 5.0),
            comments=fake.text(max_nb_chars=200),
        )
        db.session.add(performance)

    db.session.commit()
    print(f"{n} performances seeded successfully.")

# Run seeding functions
def seed_db():
    # Create app context explicitly
    with app.app_context():  # This ensures we're inside an application context
        # Clear any existing data
        db.drop_all()
        db.create_all()

        # Seed the database
        seed_employees()
        seed_leaves()
        seed_payrolls()
        seed_performances()

        print("Database seeding complete.")

if __name__ == '__main__':
    seed_db()
