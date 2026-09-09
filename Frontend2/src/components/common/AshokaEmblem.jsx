export default function AshokaEmblem({ className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center shrink-0 ${className}`}>
      <svg className="w-10 h-12 text-[#996515]" fill="currentColor" viewBox="0 0 24 30">
        <path d="M12 2C10.5 2 9.5 3 9.5 4.2C9.5 4.8 9.8 5.4 10.2 5.8C8.5 6.4 7.2 7.9 7 9.8H6V11H7C7.2 12.8 8.4 14.3 10.1 14.9C9.5 15.5 9 16.4 9 17.5V19H5V21H19V19H15V17.5C15 16.4 14.5 15.5 13.9 14.9C15.6 14.3 16.8 12.8 17 11H18V9.8H17C16.8 7.9 15.5 6.4 13.8 5.8C14.2 5.4 14.5 4.8 14.5 4.2C14.5 3 13.5 2 12 2ZM12 4C12.3 4 12.5 4.2 12.5 4.5C12.5 4.8 12.3 5 12 5C11.7 5 11.5 4.8 11.5 4.5C11.5 4.2 11.7 4 12 4ZM9 10C9 8.3 10.3 7 12 7C13.7 7 15 8.3 15 10C15 11.7 13.7 13 12 13C10.3 13 9 11.7 9 10ZM11 19H13V21H11V19ZM4 23H20V24H4V23ZM6 25H18V26H6V25Z" />
      </svg>
      <span className="text-[8px] font-bold tracking-tighter uppercase text-[#664d17]">सत्यमेव जयते</span>
    </div>
  )
}
