import { configureStore } from "@reduxjs/toolkit";
import {
    TypedUseSelectorHook,
    useDispatch as useDispatchLib,
    useSelector as useSelectorLib,
} from "react-redux";
import { CreateTaskSlice } from "./taskSlice/CreateTaskSlice";

export const store = configureStore({
    reducer: {
        [CreateTaskSlice.reducerPath]: CreateTaskSlice.reducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = useDispatchLib;
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorLib;
