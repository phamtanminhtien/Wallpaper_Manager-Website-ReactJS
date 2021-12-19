import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { database } from '../../../firebase';
import {
  Grid,
  Card,
  CardHeader,
  Button,
  Divider,
  CardActions,
  CardContent,
  LinearProgress
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  actions: {
    justifyContent: 'flex-end'
  },
  bg_dtag: {
    border: '1px solid #000'
  }
}));

const DND = props => {
  const classes = useStyles();
  const grid = 8;
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [contentU, setContentU] = useState([]);

  const getList = id => {
    if (id === 'category') {
      return categories;
    } else {
      return contentU;
    }
  };
  const { name, onClickSave, onFinishSave } = props;
  useEffect(() => {
    database
      .ref('Category')
      .once('value')
      .then(snapshot => {
        var categories = [];
        var extra = [];
        database
          .ref('Extra')
          .child(name)
          .once('value')
          .then(snapshotExtra => {
            snapshotExtra.forEach(childExtra => {
              extra.push({
                mId: childExtra.val().mId,
                mName: childExtra.val().mName,
                mUrl: childExtra.val().mUrl
              });
            });
            snapshot.forEach(child => {
              for (const v in extra) {
                if (extra[v].mId === child.key) return;
              }
              categories.push({
                mId: child.key,
                mName: child.val().mName,
                mUrl: child.val().mUrl
              });
            });
            setCategories(categories);
            setContentU(extra);
            setLoading(false);
          });
      });
  }, [name]);
  const handleClickSave = () => {
    onClickSave();
    database
      .ref('Extra')
      .child(name)
      .set(contentU)
      .then(e => {
        if (!e) {
          onFinishSave();
        }
      });
  };
  const onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      if (source.droppableId === 'content') {
        setContentU(items);
      } else {
        setCategories(items);
      }
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );
      setCategories(result.category);
      setContentU(result.content);
    }
  };
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: 'white',
    border: '1px solid #dedede',
    ...draggableStyle
  });

  const getListStyle = () => ({
    marginTop: 10,
    marginBottom: 15,
    background: 'white',
    border: '1px solid #d4d4d4',
    padding: grid,
    width: '100%'
  });
  return (
    <>
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid item lg={4} sm={4} xl={4} xs={12}>
          <Card>
            <CardHeader
              action={
                <Button size="small" variant="text">
                  Detail <ArrowDropDownIcon />
                </Button>
              }
              title={name}
            />
            <Divider />
            <CardContent>
              <DragDropContext onDragEnd={onDragEnd}>
                Category
                <Droppable droppableId="category">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}>
                      {categories.map((item, index) => (
                        <Draggable
                          key={item.mId}
                          draggableId={item.mId}
                          index={index}>
                          {provided => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}>
                              {item.mName}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                Tabs
                <Droppable droppableId="content">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}>
                      {contentU.map((item, index) => (
                        <Draggable
                          key={item.mId}
                          draggableId={item.mId}
                          index={index}>
                          {provided => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}>
                              {item.mName}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>

            <Divider />
            <CardActions className={classes.actions}>
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={handleClickSave}>
                Save <SaveIcon fontSize="small" />
              </Button>
            </CardActions>
          </Card>
        </Grid>
      )}
    </>
  );
};

export default DND;
