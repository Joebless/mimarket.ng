import "@styles/Success.scss"

const Canceled = () => {
  return (
    <div className="success">
      <h1>Payment Canceled</h1>
      <p>You canceled your purchase!</p>
      <a href="/">CONTINUE TO SHOPPING</a>
    </div>
  );
};

export default Canceled;