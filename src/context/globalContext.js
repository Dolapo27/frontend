import {useState, createContext, useContext, } from "react";
import axios from "axios"

const BASE_URL = "http://localhost:3000/api/v1/";

const GlobalContext = createContext()

export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)


    
    const addIncome = async(income) => {
        const response = await axios.post(`${BASE_URL}add-income`, income)
            .catch((err) => {
                setError(err.response.data.message)
        })
        getIncomes()

    }


    const getIncomes = async() => {
        const response = await axios.get(`${BASE_URL}get-incomes`)
        setIncomes(response.data)
        console.log(response.data)
    }

   const deleteIncome = async(id) => {
    const response = await axios.delete(`${BASE_URL}delete-incomes/${id}`)
    getIncomes()
   }

   const totalIncome = () => {
        let total = 0;
        incomes.forEach((income) =>{
            total += income.amount
        })

     return total

    }


    //calcaulate expenses
     const addExpense = async (expense) => {
        const response = await axios.post(`${BASE_URL}add-expenses`, expense)
            .catch((err) =>{
                setError(err.response.data.message)
            })
            
        getExpense()
    }

    const getExpense = async () => {
        const response = await axios.get(`${BASE_URL}get-expenses`)
        setExpenses(response.data)
        console.log(response.data)
    }

    const deleteExpense = async (id) => {
        const res  = await axios.delete(`${BASE_URL}delete-expense/${id}`)
        getExpense()
    }

    const totalExpenses = () => {
        let total = 0;
        expenses.forEach((expense) =>{
            total += expense.amount
        })

        return total;
    }


    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a,b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        }) 
        return history.slice(0, 3)
    }
   


    return (
        <GlobalContext.Provider 
            value={
                {addIncome,
                 getIncomes,
                 incomes, 
                 deleteIncome,
                 expenses,
                 error,
                 setError,
                 totalIncome,
                 addExpense,
                 getExpense,
                 deleteExpense,
                 totalExpenses, 
                 totalBalance,
                 transactionHistory
                }
            }
        >
            {children}
        </GlobalContext.Provider>
    )
} 


export const useGlobalContext = () => {
    return useContext(GlobalContext)
}