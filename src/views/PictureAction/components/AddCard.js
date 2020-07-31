import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
const [URL, UPLOAD] = [0, 1];
const useStyles = makeStyles(() => ({
  root: {},
  container: {
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const AddCard = props => {
  const { className, ...rest } = props;
  const [method, setMethod] = useState(URL);
  const classes = useStyles();
  const handleChange = () => {
    setMethod(method == URL ? UPLOAD : URL);
  };
  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        action={
          <Button size="small" variant="text">
            Last 7 days <ArrowDropDownIcon />
          </Button>
        }
        title="Latest Sales"
      />
      <Divider />
      <CardContent>
        <div className={classes.container}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Method</FormLabel>
            <RadioGroup
              aria-label="method-upload"
              name="method-upload"
              value={method}
              onChange={handleChange}>
              <FormControlLabel value={URL} control={<Radio />} label="Url" />
              <FormControlLabel
                value={UPLOAD}
                control={<Radio />}
                label="Upload File"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button color="primary" size="small" variant="text">
          Overview <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

AddCard.propTypes = {
  className: PropTypes.string
};

export default AddCard;
