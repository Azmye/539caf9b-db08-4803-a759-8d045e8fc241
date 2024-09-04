import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { employees } from '_mock/employees';
import { SaveAllEmployeeDto } from './dto/save-all-employee.dto';

@Injectable()
export class EmployeeService {
  private readonly employee = employees;

  create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const newEmployee = {
        id: this.employee.length + 1,
        ...createEmployeeDto,
      };

      this.employee.push(newEmployee);

      return {
        status: HttpStatus.CREATED,
        message: 'Success',
        data: newEmployee,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  findAll(page: number = 1, limit: number = 5, search?: string) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPages = Math.ceil(this.employee.length / limit);
    const size = this.employee.length;

    const sortedEmployees = [...this.employee].sort((a, b) => b.id - a.id);

    const results = sortedEmployees.slice(startIndex, endIndex);

    if (search) {
      const filteredResults = results.filter((employee) => {
        return (
          employee.firstName.toLowerCase().includes(search.toLowerCase()) ||
          employee.lastName.toLowerCase().includes(search.toLowerCase()) ||
          employee.position.toLowerCase().includes(search.toLowerCase()) ||
          employee.phone.toLowerCase().includes(search.toLowerCase()) ||
          employee.email.toLowerCase().includes(search.toLowerCase())
        );
      });
      return {
        status: HttpStatus.OK,
        message: 'Success',
        total: filteredResults.length,
        size: size,
        totalPages: totalPages,
        data: filteredResults,
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'Success',
      total: results.length,
      totalPages: totalPages,
      size: size,
      data: results,
    };
  }

  findOne(id: number) {
    const employee = this.employee.find((employee) => employee.id === id);

    if (!employee) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Employee not found',
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'Success',
      data: employee,
    };
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const updatedEmployee = this.employee.findIndex(
      (employee) => employee.id === id,
    );

    if (updatedEmployee === -1) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Employee not found',
      };
    }

    if (updatedEmployee !== -1) {
      this.employee[updatedEmployee] = {
        ...this.employee[updatedEmployee],
        ...updateEmployeeDto,
      };
    }

    return this.findOne(id);
  }

  remove(id: number) {
    const deletedEmployee = this.employee.findIndex(
      (employee) => employee.id === id,
    );

    if (deletedEmployee === -1) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Employee not found',
      };
    }

    this.employee.splice(deletedEmployee, 1);

    return {
      status: HttpStatus.OK,
      message: 'Success',
    };
  }

  saveAll(saveAllEmployeeDto: SaveAllEmployeeDto) {
    const { employees } = saveAllEmployeeDto;

    for (const employee of employees) {
      const isExist = this.employee.find((e) => e.id === employee.id);

      if (isExist) {
        this.update(employee.id, employee);
      } else {
        this.create(employee as CreateEmployeeDto);
      }
    }

    return {
      status: HttpStatus.OK,
      message: 'Success',
    };
  }
}
