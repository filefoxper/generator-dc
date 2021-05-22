存放各种页面路由（route）

```
pages
    |
    home
       |
       components.tsx
       layout.tsx
       index.tsx
       type.ts
       service.ts
       module.ts
       style.less
```
index.tsx
```tsx
import React,{memo} from 'react';
import {Route} from 'react-router';
import Layout from './layout.tsx';

export const HomeRoute = memo(({path}:{path:string})=> {
    return <Route path={path} component={Layout}/>
})
```
module.ts
```ts
import {OriginAgent} from 'agent-reducer';
import HomeService from './service';
import {State,Message,Statistic} from './type';

const getDefaultState=():State=>{
    return {};
}

export class HomeModule implements OriginAgent<State>{

    state = getDefaultState();

    changeInitialState = (state:State)=> {
        return {...this.state,...state};
    }

    changeStateByMessagesAndStatistics = (messages:Message[],statistics:Statistic[])=> {
        const importantMessage = messages.find(({important})=>important);
        return {...this.state,messages,statistics,importantMessage};
    }

    async fetchState(){
        const messagesLoader = new HomeService().getMessages();
        const statisticsLoader = new HomeService().getStatistics();
        const [messages,statistics]=await Promise.all([messagesLoader,statisticsLoader]);
        this.changeStateByMessagesAndStatistics(messages,statistics);
    }
}
```