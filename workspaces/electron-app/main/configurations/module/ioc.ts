import "reflect-metadata";
import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";

let container = new Container();
container.load(buildProviderModule());

export default container;