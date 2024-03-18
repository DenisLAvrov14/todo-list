import { QueryClient, useMutation, useQueryClient } from "react-query";
import todosService from "../services/todos.service";

// export const useDeleteTask = () => {
//   return useQuery({
//     queryKey: ["todos_delete"],
//     queryFn: () => todosService.deleteTask,
//     retry: 2,
//   });
// };

const useDeleteTask = (queryClient: QueryClient) => {
  const deleteTask = async (id: string) => {
    await todosService.deleteTask(id);
    queryClient.invalidateQueries("todos");

    return id;
  };

  return useMutation(deleteTask);
};

export default useDeleteTask;
