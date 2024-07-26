import {create} from "zustand";
const useStore = create((set,get) => ({
    userColor:null,
    user:null,
    allUsers:[],
    error:"",
    boughtBuildings: [],
    setBoughtBuildings: val => set({boughtBuildings:val}),
    setError: val => set({error:val}),
    setAllUsers: val => set({allUsers:val}),
    setUser: val => set({user:val}),
    setUserColor: val => set({userColor:val}),




}))

export default useStore