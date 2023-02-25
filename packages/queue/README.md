# queue

# User Story

1. Me, as a user, want to add things to be cooked on microwave in FIFO order for a specif amount of time.
2. Me, as a user, want to know what is being cooked at the moment.
3. The microwave will say that something is done cooking.
4. The microwave will request a new thing to be cooked.

# Data structure

To accomplish what has been requested from the user stories some data will need to be stored and the data will be;

``` typescript
{
  "id", "some-cool-uuid",
  "alias", "Well, that will be a good meal.",
  "timeInSeconds", 421,
  "requester", "My fridge",
  "status", "PENDING" | "COOKING"
}
```

# Methods

From the user stories described above, we will need to develop 4 methods.

### add()
This method will be responsible for add an object on the queue with the following properties;

``` typescript
{
  "alias", "Here we are going to give a name for the thing. i.e Morning coffee.",
  "timeInSeconds", 30, // This means that we will cook the thing for 30 seconds
  "requester", "That's the name from who/what requested."
}
```
The response from this method will be an ID of the object added.

### consume()
This method will fetch the first element from queue, if it exists.

### consume()
This method will remove current cooking element from database, if it exists.

### state()
This method will return the current state of the queue with pending and current status for the object.
