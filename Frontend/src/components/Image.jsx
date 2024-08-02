import indigoImage from "../assets/indigo.jpg";
export const Image = () => {
  return (
    <div
      className="h-screen"
      style={{
        backgroundImage: `url(${indigoImage})`,
        backgroundSize: "cover",
        backgroundPosition: "left center",
      }}
    ></div>
  );
};
