function NotFound() {
  return (
    <div>
      <center className="text-7xl">404 Not Found</center>
      <center className="text-2xl mt-4">
        The page you are looking for does not exist.
      </center>
      <center className="mt-6 text-xl ">
        <button onClick={() => history.back()}>Go Back</button>
      </center>
    </div>
  );
}

export default NotFound