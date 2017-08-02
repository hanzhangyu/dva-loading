# dva-loading (plus)

This profile is forked from [dvajs/dva-loading](https://github.com/dvajs/dva-loading)


### Why

There has some [problems](https://github.com/dvajs/dva-loading/issues/20) when I use `dva-loading `.So I modified the creatLoading function.

### Usage

```javascript
import createLoading from 'dva-loading';

const app = dva();
app.use(createLoading(opts,ignore));
```
The `ignore` is a array which control the `loading` is listening to some effect or not ( Maybe some effect is sustained ) .

For example:
```javascript
// modal>effects
*someEffect ({payload, onBack}, {call, select, put}) {
   const delay=(timeout=30000)=> {
      return new Promise(resolve => {
        let taskID = setTimeout(resolve, timeout);
        config.taskID = taskID;
      });
    }
    while (true) {
      yield call(delay, config.taskTime);
    }
}
// index
import createLoading from 'dva-loading';

const app = dva();
app.use(createLoading({},['namespace/someEffect']));
```

In the containers we have `loading.models.namasace` and  `loading.models.namasaceAll`, the `loading.models.namasaceAll` will listen to nested effects.
