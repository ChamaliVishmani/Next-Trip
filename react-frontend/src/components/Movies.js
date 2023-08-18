import React from "react";
import { Header, List, Rating } from "semantic-ui-react";

export const Movies = ({ movies }) => {
  return (
    <List>
      {movies.map((movie) => {
        return (
          <List.Item key={movie.title}>
            <Header>{movie.title}</Header>
            <Rating rating={movie.rating} maxRating={10} disabled />
          </List.Item>
        );
      })}
    </List>
  );
};
