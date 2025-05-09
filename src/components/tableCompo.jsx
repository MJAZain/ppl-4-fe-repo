// components/DataTable.jsx
import React from "react";

function DataTable({ columns, data, showIndex = false }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md border">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr>
            {showIndex && (
              <th className="px-4 py-3 border-b-2 border-black text-center font-bold text-[18px] leading-[24px] text-black font-[Open_Sans]">
                No.
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-4 py-3 border-b-2 border-black text-center font-bold text-[18px] leading-[24px] text-black font-[Open_Sans]"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {showIndex && (
                <td className="px-4 py-3 border-b-2 border-black text-center text-[18px] leading-[24px] text-black font-[Open_Sans] font-normal">
                  {idx + 1}
                </td>
              )}
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className="px-4 py-3 border-b-2 border-black text-center text-[18px] leading-[24px] text-black font-[Open_Sans] font-normal"
                >
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
