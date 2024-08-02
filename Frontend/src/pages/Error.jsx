export const Error = ({message}) => {
    return (
        <div className="bg-black h-screen flex justify-center items-center">
            <h1 className="text-white text-4xl text-gray-300">{message}</h1>
        </div>
    )
}