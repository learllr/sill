export default function FileInfo({ title, name, size }) {
  return (
    <>
      {title && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
          {title}
        </div>
      )}
      {name && (
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-70 text-black text-sm px-2 py-1 rounded">
          {name.split(".").pop().toUpperCase()}
        </div>
      )}
      {size && (
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-70 text-black text-sm px-2 py-1 rounded">
          {`${(size / 1024 / 1024).toFixed(2)} MB`}
        </div>
      )}
    </>
  );
}
