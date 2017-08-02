const SHOW = '@@DVA_LOADING/SHOW';
const HIDE = '@@DVA_LOADING/HIDE';
const NAMESPACE = 'loading';

/**
 * 插件初始化
 * @param opts
 * @param ignore 在使用中发现有些effect永远不会停止，因为要不断对服务器做轮询
 * @returns {*}
 */
function createLoading(opts = {},ignore=[]) {
  const namespace = opts.namespace || NAMESPACE;
  let initialState = {
    global: false,
    models: {},
  };

  if(Object.prototype.toString.call(ignore) !=='[object Array]'){
    throw new Error('The second param for createLoaing is expected to array');
    ignore=[];
  }

  if (opts.effects) {
    initialState.effects = {};
  }

  const extraReducers = {
    [namespace](state = initialState, { type, payload }) {
      const { namespace, actionType } = payload || {};
      const namespaceCountStr=`${namespace}Count`;
      const namespaceAllStr=`${namespace}All`;
      let namespaceCount=state.models[namespaceCountStr];
      let ret;
      switch (type) {
        case SHOW:
          namespaceCount=namespaceCount?namespaceCount+1:1;
          ret = {
            ...state,
            global: true,
            models: { ...state.models, [namespace]:true, [namespaceAllStr]:true,[namespaceCountStr]:namespaceCount },
          };
          if (opts.effects) {
            ret.effects = { ...state.effects, [actionType]: true };
          }
          break;
        case HIDE:
          namespaceCount=namespaceCount?namespaceCount-1:0;
          const models = { ...state.models, [namespace]:false, [namespaceAllStr]:namespaceCount!==0 ,[namespaceCountStr]:namespaceCount };
          const global = Object.keys(models).some(namespace => {
            return models[namespace];
          });
          ret = {
            ...state,
            global,
            models,
          };
          if (opts.effects) {
            ret.effects = { ...state.effects, [actionType]: false };
          }
          break;
        default:
          ret = state;
          break;
      }
      return ret;
    },
  };

  function onEffect(effect, { put }, model, actionType) {
    const { namespace } = model;
    return function*(...args) {
      const noIgnore=ignore.indexOf(actionType===-1);
      if(noIgnore){
        yield put({ type: SHOW, payload: { namespace, actionType } });
        yield effect(...args);
        yield put({ type: HIDE, payload: { namespace, actionType } });
      }else{
        yield effect(...args);
      }
    };
  }

  return {
    extraReducers,
    onEffect,
  };
}

export default createLoading;
