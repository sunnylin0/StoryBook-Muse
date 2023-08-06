import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Muse from './Muse';
import { Border, Make, OuterBorder } from './Border';
import MuseNoise, { Noise } from './MuseNoise';
import MuseNotation, { Notation, MuseNotationInfo } from './MuseNotation';
import MuseConfig from "./MuseConfig";
import MusePage from './MusePage';



let jsonResult =
    `{"title": "清平乐·禁庭春昼", "subtitle": "琵琶弹唱","author": "原曲：赵亮棋|改编记谱：团　儿","rhythmic": "6236","speed": "","C": "C",
"pages": [{"paragraphs": [{ "measures": [{"rows": [{"noises": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"noises": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]},
{"noises": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]}]},
{"rows": [{"noises": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"noises": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]}  ]},
{"rows": [{"noises": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"noises": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]}  ]},
{"rows": [{"noises": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"noises": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]}  ]} ]     }],
"lines": [{ "tracks": [{  "bars": [{"notes": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"notes": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"notes": [{ "n": "0@0|0"},{"n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"notes": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]}  ]},
{  "bars": [
{"notes": [{ "n": "6++@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]},
{"notes": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "2@1|0"},{ "n": "3@1|0"},{ "n": "5-@0|0"}]},
{"notes": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]},
{"notes": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "2@1|0"},{ "n": "3@1|0"},{ "n": "1@0|0"}
]}  ]} ]     }]    }]}`;

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Example/TextMuse',
    component: Muse,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof Muse>;



// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Muse> = (args) => <Muse {...args} />;


const Template2: ComponentStory<typeof Border> = (args) => <svg><Border {...args} /></svg>;
export const BorderS1 = Template2.bind({});

BorderS1.args = {
    clazz: 'border',
    show: true,
    w: 20,
    h: 20,
    x: 4,
    y: 5,
    color: '#441'
};


const Template3: ComponentStory<typeof OuterBorder> = (args) => <svg><OuterBorder {...args} /></svg>;
export const OuterBorderS1 = Template3.bind({});
OuterBorderS1.args = {
    clazz: 'outerborder',
    show: true,
    w: 20,
    h: 20,
    x: 13,
    y: 15,
    color: '#414'
};

const Template4: ComponentStory<typeof Make> = (args) => <svg>123<Make {...args} /></svg>;
export const MakeS1 = Template3.bind({});
MakeS1.args = {
    clazz: 'make',
    show: true,
    w: 100,
    h: 20,
    x: 30,
    y: 30,
    color: '#144'
};

const Temp8: ComponentStory<typeof MusePage> = (args) => <svg width='1000' height='2000'><MusePage {...args} /></svg>;
export const MNPage = Temp8.bind({});
let pageJSON = new Notation(JSON.parse(jsonResult), new MuseConfig());

MNPage.args = {
    info: pageJSON.info,
    config: pageJSON.config,
    clazz: 'MuseInfo',
    page: pageJSON.pages[0]
};

const Temp7: ComponentStory<typeof MuseNotationInfo> = (args) => <svg width='1000' height='2000'><MuseNotationInfo {...args} /></svg>;
export const MNInfo = Temp7.bind({});
let notaJSON = new Notation(JSON.parse(jsonResult), new MuseConfig());
MNInfo.args = {
    info: notaJSON.info,
    config: notaJSON.config,
    clazz: 'MuseInfo'

};

const Temp6: ComponentStory<typeof MuseNotation> = (args) => <MuseNotation {...args} />;
export const MNS = Temp6.bind({});
MNS.args = {
    notation: new Notation(JSON.parse(jsonResult), new MuseConfig()),    
    info: pageJSON.info,
    config: pageJSON.config,
    clazz: 'MuseInfo',
    page: pageJSON.pages[0]
};




//const Temp5: ComponentStory<typeof MuseNoise> = (args) => <svg>123<MuseNoise {...args} /></svg>;
//export const MuseNoiseS1 = Temp5.bind({});
//let nono: Noise;
//console.log('typeof MuseNoise123');
//nono = new Noise({ n: "0" }, null, 321);
//MuseNoiseS1.args = {
//    noise: nono
//};



interface TextProps {
 /**
 * What background color to use
 */
    size: number;
    /**
     * What background color to use
     */
    backgroundColor?: string;
    X?: number;
    Y?: number;
    /**
     * Button contents
     */
    label: string;
    children?: React.ReactNode;

}

/**
 * Primary UI component for user interaction
 */
const Text = ({
    children,
    size = 3,
    backgroundColor,
    label = 'able',
    X = 0,
    Y = 0,
    ...props
}: TextProps) => {
    return (
        <text
            type="button"
            className='storybook-button'
            style={{ backgroundColor }}
            {...props}
        >
            { children}
        </text>
    );
};