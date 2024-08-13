import React from 'react'
import 
{ BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}
 from 'react-icons/bs'
 import 
 { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
 from 'recharts';
 import './CardsArea.css'

function Barrchart() {

    const data = [
        {
          name: 'Monday',
          completed: 40,
          pending: 5,
          
        },
        {
          name: 'Tuesday',
          completed: 35,
          pending: 9,
        },
        {
          name: 'Wednesday',
          completed: 37,
          pending: 3,
        },
        {
          name: 'Thursday',
          completed: 30,
          pending: 6,
        },
        {
          name: 'Friday',
          completed: 29,
          pending: 5,
        },
        {
          name: 'Saturday',
          completed: 34,
          pending: 2,
        },
      
      ];
     

  return (
    
        <div className='charts'>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#8884d8" />
                <Bar dataKey="pending" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>


        </div>
    
  )
}

export default  Barrchart
