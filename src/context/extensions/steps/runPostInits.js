import manageRocObject, { handleResult } from '../helpers/processRocObject';

export default function runPostInits(initialState) {
    return initialState.temp.postInits.reduceRight(
        (state, { postInit, name }) =>
            manageRocObject(
                handleResult({ name },
                    postInit({
                        context: state.context,
                        localDependencies: state.dependencyContext.extensionsDependencies[name],
                    })
                ), state, false, false
            ),
        initialState
    );
}
