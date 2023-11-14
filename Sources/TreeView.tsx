interface FolderTreeData {
	id: string;
	name: string;
	children?: FolderTreeData[];
}

let folderTreeData: FolderTreeData = {
	id: "root",
	name: app.vault.getName().toUpperCase(),
	children: [
		{
			id: "project",
			name: "Project",
			children: []
		},
		{
			id: "area",
			name: "Area",
			children: []
		},
		{
			id: "resource",
			name: "Resource",
			children: []
		},
		{
			id: "archive",
			name: "Archive",
			children: []
		}
	]
}

function TreeNode({node}) {
	const {children, label} = node;

	const [showChildren, setShowChildren] = useState(false);

	const handleClick = () => {
		setShowChildren(!showChildren);
	};
	return (
		<>
			<div onClick={handleClick} style={{marginBottom: "10px"}}>
				<span>{label}</span>
			</div>
			<ul style={{paddingLeft: "10px", borderLeft: "1px solid black"}}>
				{showChildren && <Tree treeData={children}/>}
			</ul>
		</>
	);
}
