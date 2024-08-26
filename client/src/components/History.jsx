import React from 'react';

const History = ({ history }) => {
    return (
        <div className=" text-left m-[20px]">
            <h3>Move History</h3>
            <ul>
                {history?.map((move, index) => (
                    <li key={index}>{move}</li>
                ))}
            </ul>
        </div>
    );
};

export default History;
