export interface Task {
  id: number;
  name: string;
  description: string;
  volunteer_limit: number;
  current_volunteers: number;
  task_location: string;
  start_time: string;
  end_time: string;
  area_id: number;
}