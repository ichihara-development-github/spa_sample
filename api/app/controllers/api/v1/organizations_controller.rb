module Api
    module V1
        class OrganizationsController < ApplicationController

            def create
                debugger
                organization = Organization.new(
                    org_params[:orgParams]
                )
                employee = organization.employees.build(
                )
                if employee.save!
                    render json: {}, status: :ok
                end
            end

            def employees_shifts
                render json: {
                    shifts: @organization.shifts.attend.from_last_year
                            }, status: :ok
            end

            
            def manage_timestamps
                timestamps = Timestamp.where(employee_id: @organization.employees.ids).order(:confirmed)
                return  render json: {
                    attendances: timestamps
                            }, status: :ok
            end  

            private

            def org_params
                params.require(:organizations).permit(orgParams: [:name, :address, :lat, :lng])
            end

        end

    end

end