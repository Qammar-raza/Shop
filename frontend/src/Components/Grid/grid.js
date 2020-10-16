import React from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
  Grid,
} from "@material-ui/core";

import { Link } from "react-router-dom";
const useStyles = makeStyles({
  root1: {
    flexGrow: 1,
  },
  root2: {
    maxWidth: 333,
    margin: "2rem auto",
  },
  media: {
    height: 140,
  },
});

const GridSpec = (props) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root1}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={6}>
          {props.posts.map((p) => (
            <Grid key={p._id} item>
              <Card className={classes.root2}>
                <CardActionArea>
                  <Link to={p._id}>
                    <CardMedia image={p.imagePath} className={classes.media} />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {p.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {p.description}
                      </Typography>
                    </CardContent>
                  </Link>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      // onClick={() => cardClicked(p._id, "deleteClick")}
                      onClick={() => props.delete(p._id)}
                    >
                      Delete
                    </Button>
                    {props.edit && (
                      <Button size="small" color="primary">
                        <Link to={"edit/" + p._id}>Edit</Link>
                      </Button>
                    )}
                    <Button size="small" color="primary">
                      <Link to={p._id}>Details</Link>
                    </Button>
                  </CardActions>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GridSpec;
