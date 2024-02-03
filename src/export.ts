import type { elements } from './index';

declare const window: any;

const downloadIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJhIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MDAgNjAwIj48cGF0aCBkPSJNMzAwLDQzOS4yMDMyMmMtNC42MTU3MywwLTguODczOTQtLjc1NTM0LTEyLjc3NDY1LTIuMjY2MDYtMy45MDE0Mi0xLjUxMTQ0LTcuNzE5OTktNC4xMzQ5OC0xMS40NTU3LTcuODcwNzJsLTExMi4yNTM1Ni0xMTIuMjUzNTZjLTQuMTc1NzItNC4xNzU3Mi02LjM1OTY1LTkuMDkzMjUtNi41NTE3OC0xNC43NTI1MS0uMTkyODUtNS42NTkzLDEuOTkxMDgtMTAuODUxNzgsNi41NTE3OC0xNS41Nzc1LDQuNzI1NjktNC43MjUsOS44MjE3OC03LjEyODkyLDE1LjI4ODIzLTcuMjExNzcsNS40NjcxNC0uMDgyMTcsMTAuNTYzNTgsMi4yMzk2NywxNS4yODkyNyw2Ljk2NTM2bDg0LjQ3NzgzLDg0LjQ3NzgzVjIxLjQyODU3YzAtNi4wOTkzMSwyLjA0Njc2LTExLjE5NTMzLDYuMTQwMzQtMTUuMjg4MTksNC4wOTI4Ni00LjA5MzU4LDkuMTg4OTUtNi4xNDAzOCwxNS4yODgyMy02LjE0MDM4czExLjE5NTM2LDIuMDQ2NzksMTUuMjg4MjMsNi4xNDAzOGM0LjA5MzU4LDQuMDkyODYsNi4xNDAzNCw5LjE4ODg5LDYuMTQwMzQsMTUuMjg4MTlWMzcwLjcxNDI5bDg0LjQ3Nzg3LTg0LjQ3Nzg3YzQuMTc1NzItNC4xNzY0MSw5LjEzNDYxLTYuMzYwNzIsMTQuODc2OC02LjU1Mjg1LDUuNzQxNC0uMTkyMTYsMTAuOTc1MDEsMi4wNzQyOSwxNS43MDA3MSw2Ljc5OTI5LDQuNTYwNyw0LjcyNTcyLDYuODgyMTUsOS43ODA3MSw2Ljk2NDI5LDE1LjE2NDk5LC4wODIxNCw1LjM4NS0yLjIzOTMxLDEwLjQzOTk5LTYuOTY0MjksMTUuMTY0OTlsLTExMi4yNTM1NiwxMTIuMjUzNTZjLTMuNzM1NzQsMy43MzU3MS03LjU1NDI4LDYuMzU5MjktMTEuNDU1Nyw3Ljg3MDcyLTMuOTAwNywxLjUxMDcyLTguMTU4OTUsMi4yNjYwNi0xMi43NzQ2OCwyLjI2NjA5Wm0tMjMwLjc2OTY1LDE2MC43OTY3OGMtMTkuNzI0OTksMC0zNi4xOTQ2NC02LjYwNzE1LTQ5LjQwODkyLTE5LjgyMTQzLTEzLjIxNDI4LTEzLjIxNDI4LTE5LjgyMTQzLTI5LjY4MzkzLTE5LjgyMTQzLTQ5LjQwODkydi04Mi40MTc1YzAtNi4wOTkzMSwyLjA0Njc5LTExLjE5NTY5LDYuMTQwMzYtMTUuMjg5MjcsNC4wOTI4Ni00LjA5MjksOS4xODg5Mi02LjEzOTMsMTUuMjg4MjEtNi4xMzkzLDYuMDk4NTcsMCwxMS4xOTQ2MywyLjA0NjQsMTUuMjg4MjEsNi4xMzkzLDQuMDkzNTcsNC4wOTM1OCw2LjE0MDM2LDkuMTg5OTcsNi4xNDAzNiwxNS4yODkyN3Y4Mi40MTc1YzAsNi41OTI4NCwyLjc0NzE1LDEyLjYzNjc4LDguMjQxNDMsMTguMTMxNzksNS40OTUsNS40OTQyNiwxMS41Mzg5Myw4LjI0MTQxLDE4LjEzMTc3LDguMjQxNDFoNDYxLjUzOTMxYzYuNTkyODQsMCwxMi42MzY4My0yLjc0NzE1LDE4LjEzMTc2LTguMjQxNDMsNS40OTQzNC01LjQ5NSw4LjI0MTQ1LTExLjUzODkzLDguMjQxNDUtMTguMTMxNzd2LTgyLjQxNzVjMC02LjA5OTMxLDIuMDQ2NzktMTEuMTk1NjksNi4xNDAzOC0xNS4yODkyNyw0LjA5MzU4LTQuMDkyOSw5LjE4OTY3LTYuMTM5MywxNS4yODgxOS02LjEzOTMsNi4wOTkzMSwwLDExLjE5NTMzLDIuMDQ2NCwxNS4yODgxOSw2LjEzOTMsNC4wOTM1OCw0LjA5MzU4LDYuMTQwMzgsOS4xODk5Nyw2LjE0MDM4LDE1LjI4OTI3djgyLjQxNzVjMCwxOS43MjQ5OS02LjYwNzE2LDM2LjE5NDY0LTE5LjgyMTQzLDQ5LjQwODkyLTEzLjIxNDI2LDEzLjIxNDI4LTI5LjY4Mzk1LDE5LjgyMTQzLTQ5LjQwODkyLDE5LjgyMTQzSDY5LjIzMDM1WiIvPjwvc3ZnPg==';

export function init(elements: elements) {
	const download = document.createElement('img');
	download.src = downloadIcon.trim();
	download.classList.add('download-icon');
	elements.helperControls.prepend(download);
	download.addEventListener('click', async (e) => {
		const downloadLink = document.createElement('a');
		downloadLink.download = 'infinitecraft.json';
		downloadLink.href = URL.createObjectURL(
			new Blob(
				[
					JSON.stringify(
						{
							discoveries: window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.discoveries,
							elements: window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements,
						},
						null,
						'\t',
					),
				],
				{ type: 'application/json' },
			),
		);
		downloadLink.dataset.downloadurl = ['application/json', downloadLink.download, downloadLink.href].join(':');
		downloadLink.style.display = 'none';
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
		setTimeout(function () {
			URL.revokeObjectURL(downloadLink.href);
		}, 1500);
	});
}
