import * as React from "react";
import * as ReactDOM from "react-dom";
import { useEffect } from "react";
interface IGreeterProps {
    message: string;
}

interface IGreeterState {
    time: Date;
}

class Greeter extends React.Component<IGreeterProps, IGreeterState> {
    public interval:any =new Date();

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

// ENHANCE: 替换掉antd组件库。。一堆莫名其妙的毛病
function Aee({ message }: {message:string})
{
    
    return (
        <GlobalContext>
            { message}
            <Foo bar="yes" />
        </GlobalContext>
    );
}
const App12: React.FC<{ message: string }> = ({
    message}: {
        message: string;
}) => {
    return (
        <GlobalContext>
            hi hi
            <Foo bar="yes" />
        </GlobalContext>
    );
}

ReactDOM.render(<Aee message={"The time is: "} />, document.getElementById("root"));

