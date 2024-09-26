import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";

const CategoryCard = ({ item }) => (
    <Card
      key={item.id}
      className="m-3 hover:scale-105 duration-300"
      style={{ background: "#E8FEFFFF" }}
    >
      <CardHeader floated={false} className="h-12 w-12 mx-auto mb-0 items-center">
        <img src={item.icon} alt="category-icon" className="object-contain" />
      </CardHeader>
      <CardBody className="text-center">
        <Typography
          variant="h4"
          color="blue-gray"
          className="mb-2 text-black text-sm font-bold"
        >
          {item.name}
        </Typography>
      </CardBody>
    </Card>
  );
export default CategoryCard;