
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useEffect } from "react";
import { Button } from "./stories/Button";
import { Border,OuterBorder,Make } from "./stories/Border";



interface IGreeterProps {
    message: string;
}

interface IGreeterState {
    time: Date;
}

class Greeter extends React.Component<IGreeterProps, IGreeterState> {
    private interval: NodeJS.Timeout;

    constructor(props: IGreeterProps) {
        super(props);
        this.state = { time: new Date() };
    }

    public componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: new Date() }), 500);
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    public render() {
        return (
            <div>
                this is sunny.lin very .<br />
                {this.props.message} <span>{this.state.time.toUTCString()}</span>
            </div>
        );
    }
}

//ReactDOM.render(<Greeter message="The time is: " />, document.getElementById("root"));



interface FooProps {
    bar?: string;
    children?: React.ReactNode;
}

const Foo = (props: FooProps) => {
    const { bar, children } = props;
    return (
        <div>
            <span>{bar}</span>
            {children}
        </div>
    );
};

const  GlobalContext=(props:any)=> {
    return (<div>globlal {props.children }</div>);
}
function RootButton(): JSX.Element {
    const [count, setCount] = React.useState(0);
    return (
        <>
            <h1>{`點擊次數為 ${count} 次`} </h1>
            <button type="button" onClick={():void => setCount(count + 1) } > 點我</button>
            </>
                )
}


function App(message) {

    return (
        <GlobalContext>
            <Foo bar="yes" />
            <RootButton />
            <Button label="a Small" size="small" />
            <Button label="a Large" size="large" />
            <svg><Border clazz="border" x={33} y={11} w={44} h={44} show /></svg>
        </GlobalContext>
    );
}

ReactDOM.render(<App message="The time is: " />, document.getElementById("root"));

