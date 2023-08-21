import React, { useState } from "react";
import { Button, Form, Input, Rating } from "semantic-ui-react";

export const MovieForm = ({ onNewMovie }) => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(1);
  return (
    <Form>
      <Form.Field>
        <Input
          placeholder="movie title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <Rating
          icon="star"
          rating={rating}
          maxRating={10}
          onRate={(_, data) => {
            setRating(data.rating);
          }}
        />
      </Form.Field>
      <Form.Field>
        <Button
          onClick={async () => {
            const movie = { title, rating };
            const response = await fetch("/add_movie", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(movie),
            });
            if (response.ok) {
              console.log("response worked!");
              onNewMovie(movie);
              setTitle("");
              setRating(1);
            }
          }}
        >
          submit
        </Button>
      </Form.Field>
      <Form.Field>
        <Button
          onClick={() => {
            var today = new Date();
            var date =
              today.getFullYear() +
              "_" +
              (today.getMonth() + 1) +
              "_" +
              today.getDate();
            var time = today.getHours() + "_" + today.getMinutes();
            var dateTime = date + "_" + time;
            console.log(dateTime);
          }}
        >
          get Current Date Time
        </Button>
      </Form.Field>
    </Form>
  );
};
