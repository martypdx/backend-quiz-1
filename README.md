# Makeup Back End Quiz

Create an express/node/mongoose/mongo server for a pet liking (raves) site.

## Rules

1. **Make an initial commit when you start your work**
1. You have **100 minutes** to complete what you can. You may not finish everything 
(and don't need to do so to get a passing score). Do focus on quality of what you complete.
1. You must complete this work on your own within the allotted time
    * Keep a good commit history to show progression of work.
    * You **need to manage your time** to have PR and last commit before deadline (remember, you can
    open PR and take advantage of travis checking your commits by pushing frequently).
1. You may use normal resources that a software developer uses on the job (docs, google, your prior work)
1. You may install npm packages of your choosing (though basic project has been provided)
1. Use general best practices and common sense
    * Highly recommended to implement what is needed, no more no less
    * Blind boilerplate may not be helpful and will likely create more work
    * **Focus effort on requirements of the lab**
1. You may ignore the presence or absence of `__v` mongoose property on 
any data format requirements (do whatever you need to with `__v` to get to passing tests)
1. You can use promises _or_ `async/await` (note: there is `respond` middleware in the `utils` folder)
1. There are very specific testing requirements listed (after the API section)
    * Recommended to **read through testing requirements first** before beginning work.
    * You are not required to do any more testing than what is listed
1. Total possible points are 75. You will be graded out of 50 points
1. Demonstrate what you can accomplish by having **passing travis ci** and showing working code.

## Overarching requirements
* Do a fork and PR like a normal lab
* Starter files have been provided
* Having a green travis on your PR will count significantly.

## API Requirements

### Accepts post of a new pet

#### `POST` to `/pet` of data in following format:

```
{
    name: <required: string>,
    type: <required: cat|dog|bird|fish|snake>,
    breed: <string>,
    catchPhrase: <string, max 140 chars>
}
```

* `name`, `type` are required
* `type` should be limited to one of specified values: `cat`, `dog`, `bird`, `fish`, `snake`

If any of those conditions are not met, make sure a 400 status code is returned.

Response to `POST` normally by returning result of `.save()`.

### Add a rave

#### POST to `/raves`:

```
{
    pet: <required: id of the pet being raved>,
    comments: <required: string, max length: 250 characters>,
    email: <required: email of the user making the rave>
}
```

All fields are required, otherwise 400 error

Check that:
* The pet id exists before saving
* The user (represented by the `email` prop) does **NOT** already have a rave for this pet. 

If either of the above conditions are not met, return 400 error and don't save the rave.

Response to `POST` normally by returning result of `.save()`.

#### `GET` to `/raves`:

```
[
    { 
        _id: "123a...bc", 
        comments: "What a cute pet", 
        email: "user@user.com", 
        pet: { _id: "340f...s9", name: "Felix", type: "cat" } 
    },
    { 
        _id: "453t...44", 
        comments: "Fancy cat!", 
        email: "user@user.com", 
        pet: { _id: "340f...s9", name: "Felix", type: "cat" } 
    },
    { 
        _id: "3ek3...4e", 
        comments: "What a swimmer", 
        email: "user@user.com", 
        pet: { _id: "444f...eb", name: "Nemo", type: "fish" } 
    },
]
```

* Returns full rave document plus populate `pet` with `name` and `type`

#### `GET` to `/pets`:

```
[
    { _id: "123a...bc", name: "Felix", type: "cat" },
    { _id: "456d...ef", name: "Nemo", type: "fish" },
    { _id: "789g...hi", name: "Nagini", type: "snake" }
]
```

* Return exact fieldset indicated above

#### `GET` to `/pets?type=<type of pet>`:

Same as above, except only return pets that match that type

#### `GET` to `/pets/:id`:

* Return the full pet document, plus add a `raves` property that is the list of 
raves for this pet.

```
{ 
  _id: "123a...bc", 
  name: "Felix", 
  type: "cat", 
  breed: "tuxedo",
  catchPhrase: "Meowsers!",
  raves: [{
    _id: "789g...hi",
    pet: "123a...bc",
    comments: "Cutest tuxedo ever!",
    email: "user@user.com"
  }, {
    _id: "597g...yp",
    pet: "123a...bc",
    comments: "Love that catch phrase!",
    email: "another@user.com"
  }] 
}
```

## Testing

You *only* need to include the following e2e test scenario (note that only things marked **Test** 
need to assert correctness):

* Connect to a test databse and drop database before test
* Test this workflow (structure into `describe`/`it`):
  1. POST two pets, each of a different type
  1. POST two raves from a single user emails to both of the pets from prior step.
  1. POST two raves from a different user email to both of the pets from first step
  1. **Test** that `GET` `/pets` returns both pets (simple array.length and name check for 
  each pet okay)
  1. **Test** that `GET` `/pets?type=<one of the pet types>` only returns the one pet of that type
  1. **Test** that `GET` `/raves` returns all four raves plus pet name and type
  1. **Test** that `GET` `/pets/:id` for one of the pets returns all fields and has the two raves