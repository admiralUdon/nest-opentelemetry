import { Routes } from "@nestjs/core";
import { HelloModule } from "app/modules/hello/hello.module";
import { DemoModule } from "app/modules/demo/demo.module";

export const appRoutes: Routes = [
    {
        path: 'api',
        children: [
            { path: 'hello', module: HelloModule },
            { path: 'demo', module: DemoModule }
        ]
    }
]