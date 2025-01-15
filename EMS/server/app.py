from flask import make_response, jsonify, request, session
from flask_restful import Api, Resource
from flask_cors import CORS
from config import db, app, bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,JWTManager
from models import Employee, Leave, Payroll, Performance
from sqlalchemy import func
from datetime import datetime

# CORS(app)
api = Api(app)
app.config['JWT_SECRET_KEY'] = 'ugdfhug765784iurhgwe87ry3r$%'

jwt = JWTManager(app)

class Index(Resource):
    def get(self):
        return make_response(jsonify({"message": "Welcome to the API!"}), 200)


class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        user = Employee.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            # Store user ID in session
            session["user_id"] = user.employee_id
            return {"message": "Login successful"}, 200
        elif user:
            return {"error": "Invalid password"}, 401
        else:
            return {"error": "User not found"}, 404
        
class CheckSession(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id:
            user = Employee.query.get(user_id)
            if user:
                response = {
                    "id": user.employee_id,
                    "username": user.username,
                    "role": user.role,
                }
                return response, 200
            else:
                return {"error": "User not found"}, 404
        else:
            return {"error": "Not logged in"}, 401

class Logout(Resource):
    def delete(self):
        if "user_id" in session:
            session["user_id"] = None
            return {"message": "Logout successful"}, 200
        else:
            return {"error": "No active session"}, 400
class SignUp(Resource):
    def post(self):
        data = request.get_json()

        # Check for missing required fields
        required_fields = ['full_name', 'username', 'email', 'id_number', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return {"error": f"{field} is required"}, 400

        # Hash the password
        password = data.get('password')
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Create Employee instance
        employee = Employee(
            full_name=data.get('full_name'),
            username=data.get('username'),
            email=data.get('email'),
            id_number=data.get('id_number'),
            _password_hash=hashed_password,  # Assuming _password_hash is the correct field
            address=data.get('address'),
            phone_number=data.get('phone_number'),
            department=data.get('department'),
            job_title=data.get('job_title'),
            employment_status=data.get('employment_status'),
            date_of_birth=datetime.strptime(data.get('date_of_birth'), '%Y-%m-%d').date(),
            date_hired=datetime.strptime(data.get('date_hired'), '%Y-%m-%d').date(),
            role=data.get('role')
        )

        # Commit the employee object to the database
        db.session.add(employee)
        db.session.commit()

        # Now that the employee is in the database, set the session
        session["user_id"] = employee.employee_id

        return {"message": "User created successfully"}, 201


class Employees(Resource):
    def get(self):
        employees = Employee.query.all()
        return jsonify([employee.to_dict() for employee in employees])

    def post(self):
        data = request.get_json()

        # Check for missing required fields
        required_fields = ['full_name', 'username', 'email', 'id_number', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return {"error": f"{field} is required"}, 400

        # Hash the password
        password = data.get('password')
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Create Employee instance
        employee = Employee(
            full_name=data.get('full_name'),
            username=data.get('username'),
            email=data.get('email'),
            id_number=data.get('id_number'),
            _password_hash=hashed_password,  # Assuming password_hash is the correct field
            address=data.get('address'),
            phone_number=data.get('phone_number'),
            department=data.get('department'),
            job_title=data.get('job_title'),
            employment_status=data.get('employment_status'),
            # Ensure that date_of_birth and date_hired are datetime.date objects, not datetime
            date_of_birth=datetime.strptime(data.get('date_of_birth'), '%Y-%m-%d').date(),
            date_hired=datetime.strptime(data.get('date_hired'), '%Y-%m-%d').date(),
            role=data.get('role')
        )

        db.session.add(employee)
        db.session.commit()

        return {"message": "User created successfully"}, 201


from datetime import datetime

class EmployeeByID(Resource):
    def get(self, employee_id):
        employee = Employee.query.get(employee_id)
        if not employee:
            return {"error": "Employee not found"}, 404
        return employee.to_dict(), 200

    def patch(self, employee_id):
        data = request.get_json()
        employee = Employee.query.get(employee_id)
        if not employee:
            return {"error": "Employee not found"}, 404

        # Update the fields with the data provided
        for key, value in data.items():
            setattr(employee, key, value)
        
        # Set the updated_at field to the current datetime
        employee.updated_at = datetime.now()

        db.session.commit()
        return {"message": "Employee updated successfully"}, 200

    def put(self, employee_id):
        data = request.get_json()

        # Check for missing required fields (assuming all fields must be provided)
        required_fields = ['full_name', 'username', 'email', 'id_number', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return {"error": f"{field} is required"}, 400

        # Fetch the employee by ID
        employee = Employee.query.get(employee_id)
        if not employee:
            return {"error": "Employee not found"}, 404

        # Hash the password if it's being updated
        password = data.get('password')
        if password:
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            data['password'] = hashed_password

        # Update all fields with the data provided
        for key, value in data.items():
            if hasattr(employee, key):  # Ensure only valid fields are updated
                setattr(employee, key, value)

        # Handle date formatting for date_of_birth and date_hired
        if 'date_of_birth' in data:
            employee.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()

        if 'date_hired' in data:
            employee.date_hired = datetime.strptime(data['date_hired'], '%Y-%m-%d').date()

        # Set the updated_at field to the current datetime
        employee.updated_at = datetime.now()

        # Ensure created_at is not updated; it should only be set during creation
        if not employee.created_at:
            employee.created_at = datetime.now()

        # Commit the changes
        db.session.commit()

        return {"message": "Employee updated successfully"}, 200

    def delete(self, employee_id):
        employee = Employee.query.get(employee_id)
        if not employee:
            return {"error": "Employee not found"}, 404

        db.session.delete(employee)
        db.session.commit()
        return {"message": "Employee deleted successfully"}, 200




class Leaves(Resource):
    def get(self):
        leaves = Leave.query.all()
        return jsonify([leave.to_dict() for leave in leaves])

    def post(self):
        data = request.get_json()

        # Convert string dates to datetime.date objects
        try:
            if 'start_date' in data:
                data['start_date'] = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
            if 'end_date' in data:
                data['end_date'] = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
            if 'created_at' in data:
                data['created_at'] = datetime.strptime(data['created_at'], '%Y-%m-%d %H:%M:%S')
        except ValueError as e:
            return {"error": f"Invalid date format: {e}"}, 400

        # Create Leave instance
        leave = Leave(**data)
        db.session.add(leave)
        db.session.commit()

        return {"message": "Leave request created successfully"}, 201


class LeaveByID(Resource):
    def get(self, leave_id):
        leave = Leave.query.get(leave_id)
        if not leave:
            return {"error": "Leave not found"}, 404
        return leave.to_dict(), 200

    def patch(self, leave_id):
        data = request.get_json()
        leave = Leave.query.get(leave_id)
        if not leave:
            return {"error": "Leave not found"}, 404

        for key, value in data.items():
            setattr(leave, key, value)
        db.session.commit()
        return {"message": "Leave request updated successfully"}, 200

    def delete(self, leave_id):
        leave = Leave.query.get(leave_id)
        if not leave:
            return {"error": "Leave not found"}, 404

        db.session.delete(leave)
        db.session.commit()
        return {"message": "Leave request deleted successfully"}, 200


class Payrolls(Resource):
    def get(self):
        payrolls = Payroll.query.all()
        return jsonify([payroll.to_dict() for payroll in payrolls])

    def post(self):
        data = request.get_json()

        # Convert payment_date to a datetime.date object
        try:
            if 'payment_date' in data:
                data['payment_date'] = datetime.strptime(data['payment_date'], '%Y-%m-%d').date()
        except ValueError as e:
            return {"error": f"Invalid date format for payment_date: {e}"}, 400

        # Create the Payroll instance
        payroll = Payroll(**data)

        # Calculate net_pay
        payroll.net_pay = payroll.calculate_net_pay()

        # Add to the database
        db.session.add(payroll)
        db.session.commit()

        return {"message": "Payroll added successfully"}, 201


class PayrollByID(Resource):
    def get(self, payroll_id):
        payroll = Payroll.query.get(payroll_id)
        if not payroll:
            return {"error": "Payroll record not found"}, 404
        return payroll.to_dict(), 200

    def patch(self, payroll_id):
        data = request.get_json()
        payroll = Payroll.query.get(payroll_id)
        if not payroll:
            return {"error": "Payroll record not found"}, 404

        for key, value in data.items():
            setattr(payroll, key, value)
        payroll.net_pay = payroll.calculate_net_pay()
        db.session.commit()
        return {"message": "Payroll updated successfully"}, 200

    def delete(self, payroll_id):
        payroll = Payroll.query.get(payroll_id)
        if not payroll:
            return {"error": "Payroll record not found"}, 404

        db.session.delete(payroll)
        db.session.commit()
        return {"message": "Payroll deleted successfully"}, 200


class Performances(Resource):
    def get(self):
        performances = Performance.query.all()
        return jsonify([performance.to_dict() for performance in performances])

    def post(self):
        data = request.get_json()

        # Convert review_date to a datetime.datetime object
        try:
            if 'review_date' in data:
                data['review_date'] = datetime.strptime(data['review_date'], '%Y-%m-%d %H:%M:%S')
        except ValueError as e:
            return {"error": f"Invalid date format for review_date: {e}"}, 400

        # Create Performance instance
        performance = Performance(**data)
        
        # Add to the database
        db.session.add(performance)
        db.session.commit()

        return {"message": "Performance record added successfully"}, 201


class PerformanceByID(Resource):
    def get(self, performance_id):
        performance = Performance.query.get(performance_id)
        if not performance:
            return {"error": "Performance record not found"}, 404
        return performance.to_dict(), 200

    def patch(self, performance_id):
        data = request.get_json()
        performance = Performance.query.get(performance_id)
        if not performance:
            return {"error": "Performance record not found"}, 404

        for key, value in data.items():
            setattr(performance, key, value)
        db.session.commit()
        return {"message": "Performance record updated successfully"}, 200

    def delete(self, performance_id):
        performance = Performance.query.get(performance_id)
        if not performance:
            return {"error": "Performance record not found"}, 404

        db.session.delete(performance)
        db.session.commit()
        return {"message": "Performance record deleted successfully"}, 200


# Register endpoints
api.add_resource(Index, '/')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(SignUp, '/signup')
api.add_resource(Logout, '/logout')
api.add_resource(Employees, '/employees')
api.add_resource(EmployeeByID, '/employees/<int:employee_id>')
api.add_resource(Leaves, '/leaves')
api.add_resource(LeaveByID, '/leaves/<int:leave_id>')
api.add_resource(Payrolls, '/payrolls')
api.add_resource(PayrollByID, '/payrolls/<int:payroll_id>')
api.add_resource(Performances, '/performances')
api.add_resource(PerformanceByID, '/performances/<int:performance_id>')

if __name__ == '__main__':
    app.run(port=5555)
