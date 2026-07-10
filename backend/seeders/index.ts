import { createAutoreply } from "./autoreply";
import { createCitizen } from "./citizen";
import { userSeeders } from "./user";



async function main() {
    // await userSeeders();
    // await createCitizen();
    await createAutoreply();
}

main();