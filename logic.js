/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */
/**
 * Sample transaction processor function.
 * @param {org.mengxuanliu.valuesharing.SampleTransaction} tx The sample transaction instance.
 * @transaction
 */
/*async function sampleTransaction(tx) {  // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    const oldValue = tx.asset.value;

    // Update the asset with the new value.
    tx.asset.value = tx.newValue;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.mengxuanliu.valuesharing.Resource');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);
  	console.log(tx.asset.value)
	/*console.log(tx.asset.value)*/
// Emit an event for the modified asset.
/* let event = getFactory().newEvent('org.mengxuanliu.valuesharing', 'SampleEvent');
    event.asset = tx.asset;
    event.oldValue = oldValue;
    event.newValue = tx.newValue;
    emit(event);
}*/

async function onChangeOwner(tx) { // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    const oldOwner = tx.Resource.owner;

    // Update the asset with the new value.
    tx.Resource.owner = tx.newOwner;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.mengxuanliu.valuesharing.Resource');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.Resource);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.mengxuanliu.valuesharing', 'ChangeOwnerEvent');
    event.Resource = tx.Resource;
    event.oldOwner = oldOwner;
    event.newOwner = tx.newOwner;
    emit(event);
    throw new Error('onChangeOwner error happened')
}

async function onViewerReadResource(vra) {
    var currentParticipant = getCurrentParticipant();
    const assetRegistry = await getAssetRegistry('org.mengxuanliu.valuesharing.Resource');
    await assetRegistry.get(vra.Resource.ResourceId);
    let index = vra.Resource.viewer.findIndex(function(element) {
            return element.viewer.getIdentifier() == currentParticipant.getIdentifier()
        })
        /*if (vra.Resource.viewer[index].counter > 0) {
            vra.Resource.viewer[index].counter--;
        } else {
            vra.Resource.viewer.splice(index, 1);
        }*/
    await assetRegistry.update(vra.Resource);
    console.log('the index is', index)
    console.log('Resource ', vra.Resource.ResourceId, 'is:\n', vra.Resource.ResourceAccess)
        /*return vra.Resource.Resource,vra.Resource.viewer[index].counter*/
}

async function onOwnerAddViewer(oav) {
    const assetRegistry = await getAssetRegistry('org.mengxuanliu.valuesharing.Resource');
    await assetRegistry.get(oav.Resource.ResourceId);
    console.log('before: ', oav.Resource.viewer.length);
    console.log(oav.viewers.length);
    let len = oav.viewers.length;
    for (var i = 0; i < len; i++) {
        let index = oav.Resource.viewer.findIndex(function(element) {
            return element.viewer.getIdentifier() == oav.viewers[i].viewer.getIdentifier()
        })
        console.log(index)
        if (index != -1) {
            console.log(oav.viewers[i].viewer.getIdentifier(), "has already in this Resource's viewer list. Do not allow to add the same viewer twice.")
        } else {
            oav.Resource.viewer.push(oav.viewers[i])
        }
    }
    await assetRegistry.update(oav.Resource);
    console.log('after: ', oav.Resource.viewer.length);

}

async function onOwnerDeleteViewer(odv) {
    const assetRegistry = await getAssetRegistry('org.mengxuanliu.valuesharing.Resource');
    await assetRegistry.get(odv.Resource.ResourceId);
    console.log('before: ', odv.Resource.viewer.length);
    console.log(odv.viewers.length);
    let len = odv.viewers.length;
    for (var i = 0; i < len; i++) {
        let index = odv.Resource.viewer.findIndex(function(element) {
            return element.viewer.getIdentifier() == odv.viewers[i].viewer.getIdentifier()
        })
        console.log(index)
        if (index != -1) {
            odv.Resource.viewer.splice(index, 1);
        } else {
            /*odv.Resource.viewer.push(odv.viewers[i])*/
            console.log("Not Found")
        }
    }
    await assetRegistry.update(odv.Resource);
    console.log('after: ', odv.Resource.viewer.length);

}

async function onOwnerAddResourceAccess(oar) {
    const assetRegistry = await getAssetRegistry('org.mengxuanliu.valuesharing.Resource');
    await assetRegistry.get(oar.Resource.ResourceId);
    console.log('before: ', oar.Resource.ResourceAccess.length);
    console.log(oar.ResourceAccess.length);
    let len = oar.ResourceAccess.length;
    for (var i = 0; i < len; i++) {
        let index = oar.Resource.ResourceAccess.findIndex(function(element) {
            return element.Name == oar.ResourceAccess[i].Name
        })
        console.log(index)
        if (index != -1) {
            console.log(oar.ResourceAccess[i].Name, "has already in this Resource. Change photo name to ", oar.ResourceAccess[i].Name + "'")
            oar.ResourceAccess[i].Name = oar.ResourceAccess[i].Name + "'"
        }
        oar.Resource.ResourceAccess.push(oar.ResourceAccess[i])
    }
    await assetRegistry.update(oar.Resource);
    console.log('after: ', oar.Resource.ResourceAccess.length);

}

async function onOwnerDeleteMultiResourceAccessByName(odr) {
    const assetRegistry = await getAssetRegistry('org.mengxuanliu.valuesharing.Resource');
    await assetRegistry.get(odr.Resource.ResourceId);
    console.log('before: ', odr.Resource.ResourceAccess.length);
    console.log(odr.ResourceAccessName.length);
    let len = odr.ResourceAccessName.length;
    for (var i = 0; i < len; i++) {
        let index = odr.Resource.ResourceAccess.findIndex(function(element) {
            return element.Name == odr.ResourceAccessName[i]
        })
        console.log(index)
        if (index != -1) {
            odr.Resource.ResourceAccess.splice(index, 1);
        } else {
            console.log("Not Found")
        }
        /*oar.Resource.ResourceAccess.push(oar.ResourceAccess[i])*/
    }
    await assetRegistry.update(odr.Resource);
    console.log('after: ', odr.Resource.ResourceAccess.length);

}

async function onOwnerUpdateResourceAccess(our){
    const assetRegistry = await getAssetRegistry('org.mengxuanliu.valuesharing.Resource');
    await assetRegistry.get(our.Resource.ResourceId);
    let len = our.ResourceAccess.length;
    for (var i = 0; i < len; i++) {
        let index = our.Resource.ResourceAccess.findIndex(function(element) {
            return element.Name == our.ResourceAccess[i].Name
        })      
        console.log(index)
        if (index != -1) {
        our.Resource.ResourceAccess[index].Url=our.ResourceAccess[i].Url;
        our.Resource.ResourceAccess[index].AuthenticationToken=our.ResourceAccess[i].AuthenticationToken;
        } else {
            console.log(our.ResourceAccess[index].Name+" Not Found")
        }
        /*oar.Resource.ResourceAccess.push(oar.ResourceAccess[i])*/
    }
    
    await assetRegistry.update(our.Resource);
    console.log('after: ', our.Resource.ResourceAccess.length);

}

/*async function onUserChangeTheirInfo(uci){
    var currentParticipant = getCurrentParticipant();
    const assetRegistry = await getAssetRegistry('org.mengxuanliu.valuesharing.UserParticipant');
    await assetRegistry.get(currentParticipant.participantId);
    currentParticipant.Name=uci.newName;
    currentParticipant.Password=uci.newPassword;
    await assetRegistry.update(currentParticipant);
}*/