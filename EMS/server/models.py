from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import relationship, validates
from datetime import datetime
from config import db, bcrypt

class Employee(db.Model, SerializerMixin):
    __tablename__ = 'employees'

    # Columns
    employee_id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), nullable=False, unique=True)
    phone_number = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    id_number = db.Column(db.Integer, nullable=False, unique=True)
    department = db.Column(db.String(50), nullable=False)
    job_title = db.Column(db.String(100), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    date_hired = db.Column(db.Date, default=datetime.utcnow)
    employment_status = db.Column(db.String(20), nullable=False, default="Full-time")
    address = db.Column(db.String(200), nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # "admin", "manager", "staff"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    leaves = relationship('Leave', back_populates='employee', cascade='all, delete-orphan')
    payrolls = relationship('Payroll', back_populates='employee', cascade='all, delete-orphan')
    performances = relationship('Performance', back_populates='employee', cascade='all, delete-orphan')

    # Validations
    @validates('email')
    def validate_email(self, key, email):
        if "@" not in email or "." not in email:
            raise ValueError("Invalid email format.")
        return email



    # Password Hashing
    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hashes may not be viewed.")

    @password_hash.setter
    def password_hash(self, password):
        hashed = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = hashed.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    def to_dict(self):
        return {
            "employee_id": self.employee_id,
            "full_name": self.full_name,
            "username": self.username,
            "email": self.email,
            "phone_number":self.phone_number,
            "id_number": self.id_number,
            "department": self.department,
            "job_title": self.job_title,
            "date_of_birth": self.date_of_birth.strftime('%Y-%m-%d'),
            "date_hired": self.date_hired.strftime('%Y-%m-%d'),
            "employment_status": self.employment_status,
            "address": self.address,
            "role": self.role,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            "updated_at": self.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
            "password":self._password_hash,
            "leaves": [leave.to_dict() for leave in self.leaves],
            "payrolls": [payroll.to_dict() for payroll in self.payrolls],
            "performances": [performance.to_dict() for performance in self.performances]
        }

    def __repr__(self):
        return f"<Employee employee_id={self.employee_id} full_name={self.full_name}>"

class Leave(db.Model, SerializerMixin):
    __tablename__ = 'leaves'
    serialize_rules = ('-employee',)

    # Columns
    leave_id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.employee_id'), nullable=False)
    leave_type = db.Column(db.String(20), nullable=False)  # "Sick", "Vacation", "Unpaid"
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="Pending")  # "Approved", "Rejected"
    reason = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    employee = relationship('Employee', back_populates='leaves')

    def to_dict(self):
        return {
            "leave_id": self.leave_id,
            "employee_id": self.employee_id,
            "leave_type": self.leave_type,
            "start_date": self.start_date.strftime('%Y-%m-%d'),
            "end_date": self.end_date.strftime('%Y-%m-%d'),
            "status": self.status,
            "reason": self.reason,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        }
    
    def __repr__(self):
        return f"<Leave leave_id={self.leave_id} employee_id={self.employee_id} status={self.status}>"

class Payroll(db.Model, SerializerMixin):
    __tablename__ = 'payrolls'
    serialize_rules = ('-employee',)

    # Columns
    payroll_id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.employee_id'), nullable=False)
    basic_pay = db.Column(db.Numeric(10, 2), nullable=False)
    loans = db.Column(db.Numeric(10, 2), default=0.00)
    nhif = db.Column(db.Numeric(10, 2), default=0.00)
    nssf = db.Column(db.Numeric(10, 2), default=0.00)
    paye = db.Column(db.Numeric(10, 2), default=0.00)
    deductions = db.Column(db.Numeric(10, 2), default=0.00)
    allowances = db.Column(db.Numeric(10, 2), default=0.00)
    net_pay = db.Column(db.Numeric(10, 2), nullable=False)
    payment_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)

    # Relationships
    employee = relationship('Employee', back_populates='payrolls')

    def calculate_net_pay(self):
        return float(self.basic_pay) + float(self.allowances) - float(self.deductions) - float(self.loans) - float(self.nhif) - float(self.nssf) - float(self.paye)

    @validates('basic_pay', 'loans', 'nhif', 'nssf', 'paye', 'deductions', 'allowances')
    def validate_non_negative(self, key, value):
        if value < 0:
            raise ValueError(f"{key} cannot be negative.")
        return value

    def to_dict(self):
        return {
            "payroll_id": self.payroll_id,
            "employee_id": self.employee_id,
            "basic_pay": float(self.basic_pay),
            "loans": float(self.loans),
            "nhif": float(self.nhif),
            "nssf": float(self.nssf),
            "paye": float(self.paye),
            "deductions": float(self.deductions),
            "allowances": float(self.allowances),
            "net_pay": float(self.net_pay),
            "payment_date": self.payment_date.strftime('%Y-%m-%d')
        }

    def __repr__(self):
        return f"<Payroll payroll_id={self.payroll_id} net_pay={self.calculate_net_pay()}>"

class Performance(db.Model, SerializerMixin):
    __tablename__ = 'performances'
    serialize_rules = ('-employee',)

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.employee_id', ondelete='CASCADE'), nullable=False)
    review_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    rating = db.Column(db.Float, nullable=False)  # Rating out of 5.0
    comments = db.Column(db.String(500), nullable=True)

    # Relationships
    employee = relationship('Employee', back_populates='performances')

    def to_dict(self):
        return {
            "id": self.id,
            "employee_id": self.employee_id,
            "review_date": self.review_date.strftime('%Y-%m-%d %H:%M:%S'),
            "rating": self.rating,
            "comments": self.comments
        }
    def __repr__(self):
        return f"<Performance id={self.id} rating={self.rating} employee_id={self.employee_id}>"
