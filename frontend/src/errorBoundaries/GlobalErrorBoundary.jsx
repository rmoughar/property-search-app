import * as React from 'react';

class GlobalErrorBoundary extends React.Component{
    constructor(props){
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(){
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo){
        console.error("Something crashed:", error, errorInfo)
    }

    render(){
        if(this.state.hasError){
            return this.props.fallback;        
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;